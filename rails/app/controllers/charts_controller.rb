class ChartsController < ApplicationController
  def index
    @watches = base_query.pluck(:watch_id).uniq
    @datasets = @watches.map do |watch|
      [
        watch,
        %w(x y z).map do |axis|
          {
            name: axis,
            data: base_query.where(watch_id: watch).pluck(:milliseconds, axis)
          }
        end
      ]
    end.to_h
  end

  private

    def base_query
      @_base_query ||= AccelerometerDataPoint.
        where("created_at > ?", 2.minutes.ago).
        where(vibe: false)
    end
end
